export interface IMaterialPayload {
  token?: string | null ;
  classId?: string | null;
  title?: string | null;
  description?: string | null;
  file?: any;
  materialType?: string | null;
  materialId?: string | null;
}

export interface ISubMaterialPayload {
  token?: string | null;
  class_id?: string | null;
  material_id?: string | null;
}

export interface MaterialCardProps {
  id?: string;
  material_name?: string;
  description: string;
  class_id?: string;
  material_link?: string;
  material_type?: string;
  setMaterialList?: (pre : any) => any;
}

export interface CreateMaterialProps {
    route: {
      params: {
        classId: string;
      };
    };
  }
