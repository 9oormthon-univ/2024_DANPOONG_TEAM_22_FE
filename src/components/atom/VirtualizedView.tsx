import React from 'react';
import {FlatList} from 'react-native';

const VirtualizedView = (props: any) => {
  return (
    <FlatList
      data={[]}
      ListEmptyComponent={null}
      keyExtractor={() => 'dummy'}
      renderItem={null}
      stickyHeaderIndices={[1]}
      ListHeaderComponent={() => (
        <React.Fragment>{props.children}</React.Fragment>
      )}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default VirtualizedView;
