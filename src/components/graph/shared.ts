const PORT_SIZE = 10;

export const yAlign = (y: number | undefined, nodeHeight: number) => {
  return (y || 0) - nodeHeight / 2;
};

export { PORT_SIZE };
