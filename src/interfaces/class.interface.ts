export interface EditClassProps {
    route: {
      params: {
        classId: string;
      };
    };
  }

export interface ClassCardProps {
    class_name? : string;
    class_id? : string;
    class_type? : string;
    start_date? : Date | string;
    end_date? : Date | string;
    setClassList? : (prev : any) => any;
}