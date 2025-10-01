
import { Product } from "@/src/features/products/domain/entities/Product";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useProducts } from "../context/productContext";

export default function UpdateProductScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getProduct, updateProduct } = useProducts();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const p = await getProduct(id!);
        if (!p) {
          setNotFound(true);
        } else {
          setProduct(p);
          setName(p.name);
          setDescription(p.description);
          setQuantity(p.quantity.toString());
        }
      } catch {
        setNotFound(true);
      }
    };
    if (id) load();
  }, [id]);

  const handleUpdate = async () => {
    if (!product) return;
    await updateProduct({
      _id: product._id,
      name,
      description,
      quantity: Number(quantity),
    });
    router.back();
  };

  if (notFound) {
    return (
      <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
        <Text variant="bodyLarge" style={{ color: "red" }}>
          Product not found
        </Text>
      </View>
    );
  }

  if (!product) {
    return (
      <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16 }}>
      {/* <Text variant="headlineMedium" style={{ marginBottom: 16 }}>
        Update Product
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

      <Button mode="contained" onPress={handleUpdate}>
        Update
      </Button>
    </View>
  );
}
