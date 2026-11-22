/** The GitHub profile fields are optional there, so each can be null. */
export interface UserDTO {
  photo: string | null;
  userId: number;
  username: string | null;
  name: string | null;
  email: string | null;
}
