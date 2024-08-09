export const Ship = (length) => {
  let hitCount = 0;
  const hit = () => hitCount++;
  const isSunk = () => hitCount >= length;
  return { length, hit, isSunk };
};
