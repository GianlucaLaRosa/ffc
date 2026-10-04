"use no memo";
import { create } from "zustand";
const useFocusedRouteStore = create(() => ({
  focused: ""
}));
const useFocusedRoute = () => useFocusedRouteStore((state) => state.focused);
const setFocusedRoute = (focused) => {
  useFocusedRouteStore.setState({
    focused
  });
};
export {
  setFocusedRoute,
  useFocusedRoute
};
