Use websockets

On clicking to join room, client opens websocket connection
An initial message is sent, detailing user info and requested room
If room is full or user ineligible for room, close connection and return error to user
If user is able to join, track user to room on server 