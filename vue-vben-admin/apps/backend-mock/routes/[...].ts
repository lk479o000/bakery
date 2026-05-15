export default defineEventHandler(async (event) => {
  return {
    status: 200,
    body: {
      message: 'Welcome to the Bakery Admin API',
    },
  };
});