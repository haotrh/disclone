const serverShortname = (name: string) => {
  return name.match(/\b(\w)/g)?.join("");
};

export default serverShortname;
