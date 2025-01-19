import { Text, View, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams, Stack } from "expo-router";
import { defaultStyles } from "@/constants/Styles";
import Button from "@/components/ui/Button";
import MemberService, { MemberProps } from "@/api/memberService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Picker } from "@react-native-picker/picker";

interface ApiMessageError {
  message: {
    role?: number;
  };
}

const MemberEdit = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { id, memberId } = useLocalSearchParams();
  const [role, setRole] = useState(3);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    isPending,
    isError,
    data: member,
    error,
  } = useQuery({
    queryKey: ["members", memberId],
    queryFn: () => MemberService.get(Number(memberId)),
  });

  useEffect(() => {
    if (!isPending && !isError) {
      setRole(member.role);
    }
  }, [member]);

  const mutation = useMutation<MemberProps, ApiMessageError, number>({
    mutationFn: (newRole) => MemberService.update(Number(memberId), newRole),
    onSuccess: (data) => {
      queryClient.setQueryData(["members", memberId], data);
      queryClient.invalidateQueries({ queryKey: ["families", id] });
      queryClient.invalidateQueries({ queryKey: ["families", id, "members"] });
      router.back();
    },
    onSettled: () => {
      setIsSubmitted(false);
    },
  });

  const handleSubmit = () => {
    setIsSubmitted(true);
    mutation.mutate(role);
  };

  return (
    <View style={[defaultStyles.container, { gap: 8 }]}>
      <Stack.Screen
        options={{
          headerShadowVisible: false,
          headerTitleAlign: "center",
          title: "Edytuj role",
          headerStyle: { backgroundColor: "#fff" },
        }}
      />
      <Text
        style={{
          fontSize: 24,
          fontFamily: "Inter-Bold",
          textAlign: "left",
        }}
        numberOfLines={1}
      >
        Edytuj role {member?.user}
      </Text>
      <View style={styles.picker}>
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
          mode={"dropdown"}
        >
          <Picker.Item label='Administrator' value={2} />
          <Picker.Item label='Członek' value={3} />
        </Picker>
      </View>
      <Button onPress={handleSubmit} isLoading={isSubmitted}>
        Zapisz
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  picker: {
    fontFamily: "Inter",
    borderWidth: 2,
    borderColor: "#EE964B",
    borderRadius: 12,
  },
});

export default MemberEdit;
