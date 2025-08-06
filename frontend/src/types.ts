export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  created_at: string;
}

export interface TodoCreate {
  text: string;
}

export interface TodoUpdate {
  text?: string;
  completed?: boolean;
}