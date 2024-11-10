import React from "react";
import { View, Text, Pressable, FlatList, StyleSheet } from "react-native";
import { Journal } from "./popupMenu";

interface PopupMenuListProps {
  memories: string,
  setSelectedJournal: (journal: Journal) => void,
  setIsDetailVisible: (b: boolean) => void,
}

export default function PopupMenuList({ memories, setSelectedJournal, setIsDetailVisible }: PopupMenuListProps) {

  const openJournalDetail = (journal: Journal) => {
    setSelectedJournal(journal);
    setIsDetailVisible(true);
  };

  return (
    <FlatList
      // key={JSON.stringify(memories)}
      data={JSON.parse(memories)}
      keyExtractor={(item) => item.id.toString()}
      extraData={JSON.parse(memories)}
      renderItem={({ item }) => (
        <View>
          <Pressable
            style={styles.journalButton}
            onPress={() =>
              openJournalDetail({
                id: item.id,
                userId: item.userId,
                pinId: item.pinId,
                title: item.title,
                category: item.category,
                condition: item.condition,
                loc: item.loc,
                initDate: new Date(item.initDate),
                endDate: new Date(item.endDate),
                captionText: item.captionText,
              })
            }
          >
            <Text style={styles.journalButtonText}>{item.title}</Text>
          </Pressable>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  journalButton: {
    backgroundColor: "#f0f0f0",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginVertical: 5,
  },
  journalButtonText: {
    fontSize: 16,
  },
});