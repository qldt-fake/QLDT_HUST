import * as yup from 'yup';

export const loginFormSchema = yup.object({
  email: yup.string()
    .email('Email không hợp lệ')
    .required('Email là bắt buộc')
    .matches(
      /@hust\.edu\.vn$|@soict\.hust\.edu\.vn$/,
      'Email phải kết thúc bằng @hust.edu.vn hoặc @soict.hust.edu.vn'
    ),
  password: yup.string().required('Mật khẩu là bắt buộc').min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .matches(/^[a-zA-Z0-9]*$/, 'Mật khẩu chỉ được chứa chữ cái và số'),
});
export const signUpFormSchema = yup.object({
  email: yup.string()
    .email('Email không hợp lệ')
    .required('Email là bắt buộc')
    .matches(
      /@hust\.edu\.vn$|@soict\.hust\.edu\.vn$/,
      'Email phải kết thúc bằng @hust.edu.vn hoặc @soict.hust.edu.vn'
    ),
  ho: yup.string()
    .required('Họ là bắt buộc'),
  ten: yup.string()
    .required('Tên là bắt buộc'),
  password: yup.string().required('Mật khẩu là bắt buộc').min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .matches(/^[a-zA-Z0-9]*$/, 'Mật khẩu chỉ được chứa chữ cái và số'),
  repassword: yup.string()
    .oneOf([yup.ref('password')], 'Mật khẩu không khớp')
    .required('Nhập lại mật khẩu là bắt buộc'),
  role: yup.string().required('Vui lòng chọn vai trò'),
});