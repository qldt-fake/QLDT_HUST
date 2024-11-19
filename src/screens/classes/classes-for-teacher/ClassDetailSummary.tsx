import { View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { formatDate } from 'src/utils/helper';
import { color } from 'src/common/constants/color';

export type ClassDetailSummaryProps = {
  class_name: string;
  class_id: string;
  start_date: string;
  end_date: string;
  class_type: string;
  student_count: number;
  lecturer_name: string;
};

const ClassDetailSummary: React.FC<ClassDetailSummaryProps> = ({
  class_name,
  class_id,
  start_date,
  end_date,
  class_type,
  student_count,
  lecturer_name
}) => {
  return (
    <View style={styles.container}>
      <View style = {styles.header}><Text>{class_id + ' - ' + class_name}</Text></View>
      <View style={styles.body}>
        <View style={styles.line}>
          <Text style={styles.row}>Mã lớp:</Text>
          <Text style={styles.row}>{class_id}</Text>
        </View>
        <View style={styles.line}>
          <Text style={styles.row}>Loại lớp:</Text>
          <Text style={styles.row}>{class_type}</Text>
        </View>
        <View style={styles.line}>
          <Text style={styles.row}>Ngày bắt đầu:</Text>
          <Text style={styles.row}>{formatDate(start_date)}</Text>
        </View>
        <View style={styles.line}>
          <Text style={styles.row}>Ngày kết thúc:</Text>
          <Text style={styles.row}>{formatDate(end_date)}</Text>
        </View>
        <View style={styles.line}>
          <Text style={styles.row}>Số sinh viên:</Text>
          <Text style={styles.row}>{student_count}</Text>
        </View>
        <View style={styles.line}>
          <Text style={styles.row}>Giảng viên:</Text>
          <Text style={styles.row}>{lecturer_name}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.white,
    with: '100%',
    marginHorizontal: 30,
    paddingHorizontal: 15,
    paddingVertical: 20,
    borderRadius: 12,
    borderWidth: 0.5,
  },
  header : {
    paddingBottom: 5,
    borderBottomWidth: .2,
  },
  body: {
    paddingTop: 10,
    rowGap: 8
  },
  line: {
    flexDirection: 'row',
  },
  row: {
    flex: 1
  }
});

export default ClassDetailSummary;
