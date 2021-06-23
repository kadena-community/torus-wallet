export default (token) => {
  if (token?.length > 10) return `${token.substring(0, 21)}...${token.substring(token.length - 4, token.length)}`;
  return token;
};
