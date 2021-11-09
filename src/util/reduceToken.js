export const reduceToken = (token) => {
  if (token?.length > 10)
    return `${token.substring(0, 21)}...${token.substring(
      token.length - 4,
      token.length
    )}`;
  return token;
};

export const reduceTokenMobile = (token) => {
  if (token?.length > 10)
    return `${token.substring(0, 5)}...${token.substring(
      token.length - 4,
      token.length
    )}`;
  return token;
};
