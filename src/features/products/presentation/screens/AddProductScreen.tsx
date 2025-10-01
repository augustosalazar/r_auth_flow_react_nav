
import { useRouter } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { useProducts } from "../context/productContext";

export default function AddProductScreen() {
  const router = useRouter();
  const { addProduct } = useProducts();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleAdd = async () => {
    if (!name.trim() || !quantity) return;

    await addProduct({
      name,
      description,
      quantity: Number(quantity),
    });

    router.back(); // go back to ProductListScreen
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
      {/* <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
        Add Product
      </Text> */}

      <TextInput
        label="Name"
        value={name}
        onChangeText={setName}
        style={{ marginBottom: 12 }}
      />

      <TextInput
        label="Description"
        value={description}
        onChangeText={setDescription}
        style={{ marginBottom: 12 }}
      />

      <TextInput
        label="Quantity"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
        style={{ marginBottom: 12 }}
      />

      <Button mode="contained" onPress={handleAdd}>
        Save
      </Button>
    </View>
  );
}
