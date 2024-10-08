import BaseFlatList from 'src/components/BaseFlatList';
import HeaderItemComment from './components/HeaderItemComment';
import CommentItem from './components/ItemComment/CommentItem';

export interface IListComments {
  listComments: {
    id: number;
    author: string;
    content: string;
    avatarUrl: string;
    timePost: string;
  }[];
}

const ListComments = (props: IListComments) => {
  return (
    <>
      {/* <ScrollView> */}
      <BaseFlatList
        ListHeaderComponent={<HeaderItemComment />}
        data={props.listComments}
        renderItem={({ item }) => (
          <>
            <CommentItem listComments={item} />
          </>
        )}
        keyExtractor={item => item.id}
      />
      {/* </ScrollView> */}
    </>
  );
};

export default ListComments;
