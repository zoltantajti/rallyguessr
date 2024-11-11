export const getPointsByDistance = (distance) => {
    const initialValue = 5000;
    const decayRate = -10;
    const exponent = decayRate * (distance / 100);
    return (initialValue * Math.exp(exponent)).toFixed(0);
};