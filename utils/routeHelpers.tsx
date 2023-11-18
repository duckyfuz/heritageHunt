import axios from "axios";

type LocationObject = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

type MarkerObject = {
  latlng: { latitude: number; longitude: number };
  title: string | undefined;
  description: string | undefined; // This actually stores the placeId
  image: number | ImageURISource | undefined;
};

export type LocationWaypoints = [[number, number]];

type ImageURISource = { uri?: string | undefined };

const requestPlacesAPI = async (location: LocationObject, distance: number) => {
  try {
    const response = await axios.get("https://maps.googleapis.com/maps/api/place/nearbysearch/json", {
      params: {
        location: `${location.latitude},${location.longitude}`,
        radius: distance,
        type: "point_of_interest",
        keyword: "historical", // Might want to personalise this
        key: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        opennow: true,
      },
    });

    if (response.data.status === "OK") {
      const currentTimestamp = Math.floor(Date.now() / 1000); // Current time in seconds

      const newMarkers: MarkerObject[] = response.data.results
        .filter(
          (result: any) => result.business_status === "OPERATIONAL"
          // && result.opening_hours?.open_now === true
        )
        .map((result: any) => {
          return {
            latlng: {
              latitude: result.geometry.location.lat,
              longitude: result.geometry.location.lng,
            },
            title: result.name,
            description: result.place_id, // Saving place_id as description
            image: result.photos?.[0]?.photo_reference,
          };
        });

      console.log(newMarkers);
      return newMarkers;
    } else {
      console.error("Places API request failed:", response.data.status);
      return [];
    }
  } catch (error) {
    console.error("Error calling Places API:", error);
    return [];
  }
};

const markerToShipments = (markersArray: Array<MarkerObject>) => {
  const pickupDuration = 120; // Duration for pickup and delivery

  const mappedArray = markersArray.map((item, index) => {
    return {
      id: `order_${index + 1}`,
      pickup: { location_index: 0, duration: pickupDuration },
      delivery: {
        location: [item.latlng.longitude, item.latlng.latitude],
        duration: pickupDuration,
      },
    };
  });

  return mappedArray;
};

function generateGoogleMapsURL(coordinates: [number, number][]): string {
  const baseUrl = "https://www.google.com/maps/dir/";

  const waypoints = coordinates.map((coord) => coord.reverse().join(",")).join("/");

  return `${baseUrl}${waypoints}/@${coordinates[0][1]},${coordinates[0][0]},15z/data=!3m1!4b1!4m2!4m1!3e2`;
}

const createRouteHandler = async (location: LocationObject, markers: MarkerObject[], time: number) => {
  const apiKey = process.env.REACT_APP_GEOAPIFY_API_KEY;
  const apiUrl = "https://api.geoapify.com/v1/routeplanner";

  const body = {
    mode: "walk",
    agents: [
      {
        start_location: [location?.longitude, location?.latitude],
        time_windows: [[0, time * 60]],
      },
    ],
    shipments: markerToShipments(markers),
    locations: [
      {
        id: "warehouse-0",
        location: [location?.longitude, location?.latitude],
      },
    ],
    type: "short",
    traffic: "approximated",
  };

  try {
    const response = await axios.post(`${apiUrl}?apiKey=${apiKey}`, body, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    const waypoints = [];
    for (const latlng of response.data.features[0].properties.waypoints) {
      latlng.location && waypoints.push(latlng.location);
    }

    return waypoints;
    // const googleMapsURL = generateGoogleMapsURL(waypoints);
    // console.log(googleMapsURL);

    // return googleMapsURL; // Return the value here
  } catch (error) {
    console.error(error);
    throw error; // Rethrow the error if needed
  }
};

const createDetailedRoute = async (waypoints: LocationWaypoints) => {
  const requestBody = waypoints.map(([lat, lon]) => [lon, lat]);

  const formattedWaypoints = requestBody.map((waypoint) => waypoint.join(","));
  const mode = "walk";
  const apiUrl = `https://api.geoapify.com/v1/routing?waypoints=${formattedWaypoints.join("|")}&mode=${mode}&apiKey=${
    process.env.REACT_APP_GEOAPIFY_API_KEY
  }`;

  try {
    const response = await axios.get(apiUrl);

    // Handle the response data here
    const tmp: [LocationWaypoints] = response.data.features[0].geometry.coordinates;

    const detailedWaypoints = tmp.map((coordinates) => coordinates.map((coord) => [coord[1], coord[0]]));

    // console.log(detailedWaypoints);

    return detailedWaypoints;
  } catch (error) {
    // Handle any errors here
    console.error(error);
    throw error; // Throw the error to propagate it
  }
};

export { LocationObject, MarkerObject, requestPlacesAPI, createRouteHandler, createDetailedRoute };
