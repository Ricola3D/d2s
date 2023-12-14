// Character name must be 2-15 characters, with at most once "-" or "_" character not placed at first or last.
export const nameRegex = /^[A-Za-z](?=.{0,14}$)[A-Za-z]*[A-Za-z\-_][A-Za-z]+$/;
