"use no memo";
import { create } from "zustand";
const useActiveAnchorStore = create(() => ({
  activeSlug: ""
}));
const useActiveAnchor = () => useActiveAnchorStore((state) => state.activeSlug);
const setActiveSlug = (activeSlug) => {
  useActiveAnchorStore.setState({
    activeSlug
  });
};
export {
  setActiveSlug,
  useActiveAnchor
};
