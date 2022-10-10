import { useEffect, useState } from "react";

function useMount() {
  const [mount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
  }, []);

  return mount;
}

export default useMount;
