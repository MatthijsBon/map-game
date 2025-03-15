import { GeoJSONFeature } from "ol/format/GeoJSON";
import { Geometry, Point } from "ol/geom";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { Feature } from "ol";
import { Coordinate } from "ol/coordinate";
import { FeatureLike } from "ol/Feature";
import { CRS } from "./constants.ts";

export function createFeatureCollection(
  features: GeoJSONFeature[],
  crs = CRS.WGS84,
) {
  return {
    type: "FeatureCollection",
    crs: {
      type: "name",
      properties: {
        name: crs,
      },
    },
    features,
  };
}

/**
 * It's hard to make the following functions readable and typesafe by directly using the Ol API.
 * This function helps us abstract the not-readable part away.
 */
export function getFeatureById(
  layer: VectorLayer<VectorSource<Feature<Geometry>>>,
  id: string | number | undefined,
): Feature<Geometry> | null {
  const source = layer.getSource();
  if (!source || !id) {
    return null;
  }
  return source.getFeatureById(id);
}

/*
 * For our use-case we only care about filtering Points by a Polygon geometry
 * An improvement could be made to make this work for other geometry, by recursively
 * check all the coordinates of a geometry and return false as soon as one coordinate
 * is not intersecting with the filterGeometry.
 */
export function getIntersectingPoints(
  source: VectorSource<Feature<Geometry>> | null,
  filterGeometry: Geometry | undefined,
): FeatureLike[] {
  const features = source?.getFeatures();
  if (!features || !filterGeometry) {
    return [];
  }

  return features.filter((feature) => {
    const coordinate = getGetPointCoordinate(feature.getGeometry());
    return coordinate && filterGeometry.intersectsCoordinate(coordinate);
  });
}

function getGetPointCoordinate(geometry?: Geometry): Coordinate | null {
  if (geometry instanceof Point) {
    return geometry.getCoordinates();
  }
  return null;
}
