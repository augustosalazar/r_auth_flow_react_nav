
import { useNavigation } from "@/.expo/types/router";
import { Product } from "@/src/features/products/domain/entities/Product";
import { useEffect, useState } from "react";
import { Button, Surface, Text, TextInput } from "react-native-paper";
import { useProducts } from "../context/productContext";

interface UpdateProductScreenProps {
  route: {
    params: {
      id: string;
    };
  };
}

export default function UpdateProductScreen({ route }: UpdateProductScreenProps) {
  const { id } = route.params;

  const navigation = useNavigation();

  const { getProduct, updateProduct } = useProducts();


  const [product, setProduct] = useState<Product | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState("");

  useEffect(() => {
    console.log("UpdateProductScreen id:", id);
    const load = async () => {
      try {
        const p = await getProduct(id);
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
  }, [getProduct, id]);

  const handleUpdate = async () => {
    if (!product) return;
    await updateProduct({
      _id: product._id,
      name,
      description,
      quantity: Number(quantity),
    });
    navigation.goBack();
  };

  if (notFound) {
    return (
      <Surface style={{ flex: 1, justifyContent: "center", padding: 16 }}>
        <Text variant="bodyLarge" style={{ color: "red" }}>
          Product not found
        </Text>
      </Surface>
    );
  }

  if (!product) {
    return (
      <Surface style={{ flex: 1, justifyContent: "center", padding: 16 }}>
        <Text>Loading...</Text>
      </Surface>
    );
  }

  return (
    <Surface style={{ flex: 1, justifyContent: "center", padding: 16 }}>
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
    </Surface>
  );
}
