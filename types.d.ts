type Message = {
  role: string;
  content: string;
};

type User = {
  id: string;
  _id: string;
  email: string;
  name: string;
  picture: string;
  token: number;
};

type WorkSpace = {
  _id: Id<"workspace">;
  _creationTime: number;
  fileData?: unknown;
  messages: Message[];
  user: Id<"users">;
};

type PaymentInfo = {
  clientSecret: string;
  paymentAmount: number;
}