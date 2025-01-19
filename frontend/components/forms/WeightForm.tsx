import { View, TouchableOpacity } from "react-native";
import { useState } from "react";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import DateTimePicker from "@react-native-community/datetimepicker";
import { WeightProps } from "@/api/details/weightService";

type WeightFormProps = {
  initialValues?: WeightProps;
  mutation: any;
};

const WeightForm = ({ initialValues, mutation }: WeightFormProps) => {
  const [formValues, setFormValues] = useState({
    weight: initialValues?.weight || "",
    date: initialValues?.date ? new Date(initialValues.date) : new Date(),
  });
  const [showPicker, setShowPicker] = useState(false);

  const handleSubmit = async () => {
    let date = new Date(formValues.date);

    if (!isNaN(date.getTime())) {
      const payload = {
        ...formValues,
        date: date.toISOString().split("T")[0],
      };

      mutation.mutate(payload);
    }
  };

  return (
    <View style={{ gap: 8 }}>
      <InputField
        onChangeText={(weight) => setFormValues({ ...formValues, weight })}
        value={formValues.weight}
        autoFocus={true}
        placeholder='Waga'
        keyboardType='numeric'
        error={mutation.error?.message.weight}
      />
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <InputField
          value={formValues.date.toLocaleDateString()}
          autoFocus={false}
          placeholder='Data'
          editable={false}
          error={mutation.error?.message.date}
        />
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={formValues.date}
          mode='date'
          display='default'
          onChange={({ type }, selectedDate) => {
            setShowPicker(false);
            if (type === "set" && selectedDate) {
              setFormValues({ ...formValues, date: selectedDate });
            }
          }}
        />
      )}
      <Button onPress={handleSubmit} isLoading={mutation.isPending}>
        {initialValues ? "Zapisz" : "Utwórz"}
      </Button>
    </View>
  );
};

export default WeightForm;
