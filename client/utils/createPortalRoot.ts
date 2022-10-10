const createPortalRoot = (id?: string) => {
  const root = document.createElement("div");
  root.setAttribute("id", id ?? "portal-root");
  return root;
};

export default createPortalRoot;
