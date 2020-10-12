export interface Image {
  id?: number;
  file_name: string;
  mimetype: string;
  uploaded_by: number;
  created_at?: Date;
  updated_at?: Date;
}

export default {
  Image,
};
