import { View, TouchableOpacity } from "react-native";
import { useState } from "react";
import InputField from "@/components/ui/InputField";
import Button from "@/components/ui/Button";
import DateTimePicker from "@react-native-community/datetimepicker";
import { HealthProps } from "@/api/details/healthService";

type HealthFormProps = {
  initialValues?: HealthProps;
  mutation: any;
};

const HealthForm = ({ initialValues, mutation }: HealthFormProps) => {
  const [formValues, setFormValues] = useState({
    name: initialValues?.name || "",
    description: initialValues?.description || "",
    place: initialValues?.place || "",
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
        onChangeText={(name) => setFormValues({ ...formValues, name })}
        value={formValues.name}
        autoFocus={true}
        placeholder='Nazwa'
        error={mutation.error?.message.name}
      />
      <InputField
        onChangeText={(description) => setFormValues({ ...formValues, description })}
        value={formValues.description}
        multiline
        maxLength={250}
        autoFocus={false}
        placeholder='Opis'
        error={mutation.error?.message.description}
      />
      <InputField
        onChangeText={(place) => setFormValues({ ...formValues, place })}
        value={formValues.place}
        autoFocus={false}
        placeholder='Miejsce'
        error={mutation.error?.message.place}
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

export default HealthForm;
