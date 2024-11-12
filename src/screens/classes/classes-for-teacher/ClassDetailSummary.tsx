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
  max_student_amount: number;
};

const ClassDetailSummary: React.FC<ClassDetailSummaryProps> = ({
  class_name,
  class_id,
  start_date,
  end_date,
  class_type,
  max_student_amount
}) => {
  return (
    <View style={styles.container}>
      <Text>{class_id + ' - ' + class_name}</Text>
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
          <Text style={styles.row}>Số lượng sinh viên tối đa:</Text>
          <Text style={styles.row}>{max_student_amount}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.white,
    with: '100%',
    marginHorizontal: 30
  },
  body: {
    rowGap: 8
  },/+9
  line: {
    flexDirection: 'row'
  },
  row: {
    flex: 1
  }
});

export default ClassDetailSummary;
