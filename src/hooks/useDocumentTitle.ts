import { useEffect } from "react";
import { useLocation, matchPath } from "react-router-dom";
import { ROUTE_TITLES } from "../routes/routeTitles";

const APP_NAME = "Wallpaper Admin";

export const useDocumentTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;
    let title = APP_NAME;

    // Find matching route
    for (const [route, routeTitle] of Object.entries(ROUTE_TITLES)) {
      if (matchPath({ path: route, end: true }, pathname)) {
        title = `${routeTitle} | ${APP_NAME}`;
        break;
      }
    }

    document.title = title;
  }, [location]);
};
