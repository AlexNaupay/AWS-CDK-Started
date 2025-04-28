export const saveGreeting = async (event) => {
    console.log('Saving...');
    return {
        statusCode: 200,
        body: "Hello from Greeting!"
    }
}