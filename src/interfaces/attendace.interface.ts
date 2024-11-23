// attendanceInterfaces.ts

// 1. Interface cho dữ liệu gửi khi điểm danh lớp
export interface IAttendanceRequest {
    token: string;
    class_id: string;
    date: string;
    attendance_list: string[];
  }
  

  
  // 3. Interface cho yêu cầu với trang và kích thước trang
  export interface IPageableRequest {
    token: string;
    class_id: string;
    date: string;
    pageable_request: {
      page: string;
      page_size: string;
    };
  }
  
  // 4. Interface cho trạng thái điểm danh của một sinh viên
  export interface IAttendanceStatusUpdate {
    token: string;
    status: "PRESENT" | "EXCUSED_ABSENCE" | "UNEXCUSED_ABSENCE";  // Trạng thái có thể là PRESENT, EXCUSED_ABSENCE, UNEXCUSED_ABSENCE
    attendance_id: string;
  }
  
  export interface IClassAttendanceRequest {
    token: string;
    class_id: string;
  }