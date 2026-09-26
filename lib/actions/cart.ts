"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/session";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getServerMessages } from "@/lib/serverMessages";
import { formatText } from "@/lib/productText";

export async function addToCart(productId: string, quantity: number) {
  const user = await requireUser();
  const t = await getServerMessages();

  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product || !product.isActive) return { error: t.server.productUnavailable };
  if (quantity < 1) return { error: t.server.minQuantity };

  const existingItem = await prisma.cart.findUnique({
    where: { userId_productId: { userId: user.id, productId } },
  });

  const totalQuantity = (existingItem?.quantity || 0) + quantity;
  if (totalQuantity > product.stock) {
    const sisaBisaDitambah = product.stock - (existingItem?.quantity || 0);
    return {
      error: sisaBisaDitambah > 0
        ? formatText(t.server.addMoreToCart, { count: sisaBisaDitambah, stock: product.stock })
        : formatText(t.server.cartAtStockLimit, { stock: product.stock }),
    };
  }

  await prisma.cart.upsert({
    where: { userId_productId: { userId: user.id, productId } },
    update: { quantity: { increment: quantity } },
    create: { userId: user.id, productId, quantity },
  });

  revalidatePath("/keranjang");
  return { success: true };
}

export async function updateCartItem(cartId: string, quantity: number) {
  const user = await requireUser();
  const t = await getServerMessages();
  const cart = await prisma.cart.findUnique({ where: { id: cartId }, include: { product: true } });
  if (!cart || cart.userId !== user.id) return { error: t.server.itemNotFound };

  if (quantity < 1) {
    await prisma.cart.delete({ where: { id: cartId } });
  } else {
    if (quantity > cart.product.stock) return { error: t.server.quantityExceedsStock };
    await prisma.cart.update({ where: { id: cartId }, data: { quantity } });
  }

  revalidatePath("/keranjang");
  return { success: true };
}

export async function removeCartItem(cartId: string) {
  const user = await requireUser();
  const cart = await prisma.cart.findUnique({ where: { id: cartId } });
  if (!cart || cart.userId !== user.id) return;

  await prisma.cart.delete({ where: { id: cartId } });
  revalidatePath("/keranjang");
}

export async function checkout(formData: FormData) {
  const sessionUser = await requireUser();
  const t = await getServerMessages();

  const user = await prisma.user.findUnique({ where: { id: sessionUser.id } });
  if (!user) return { error: t.server.userNotFound };

  const shippingAddress = String(formData.get("shippingAddress") || "").trim();
  const shippingMethod = String(formData.get("shippingMethod") || "Armada Truk Berpendingin (Cold Chain)").trim();
  const rawNotes = String(formData.get("notes") || "").trim();
  const notes = `[Armada: ${shippingMethod}]${rawNotes ? ` - Catatan: ${rawNotes}` : ""}`;

  if (!shippingAddress) return { error: t.server.addressRequired };
  if (shippingAddress.length < 10) return { error: t.server.addressTooShort };

  const cartItems = await prisma.cart.findMany({
    where: { userId: user.id },
    include: { product: true },
  });

  if (cartItems.length === 0) return { error: t.server.cartEmpty };

  for (const item of cartItems) {
    if (item.quantity > item.product.stock) {
      return { error: formatText(t.server.insufficientStock, { name: item.product.name, stock: item.product.stock }) };
    }
  }

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Gunakan crypto.randomUUID() untuk suffix yang lebih unik dan aman dari collision
  const randomSuffix = crypto.randomUUID().replace(/-/g, "").substring(0, 8).toUpperCase();
  const orderNumber = `ORD-${Date.now()}-${randomSuffix}`;

  let orderId: string;
  try {
    const order = await prisma.$transaction(async (tx) => {
      // Re-verifikasi stok di dalam transaksi agar aman dari race conditions
      for (const item of cartItems) {
        const freshProduct = await tx.product.findUnique({ where: { id: item.productId } });
        if (!freshProduct || freshProduct.stock < item.quantity) {
          throw new Error(formatText(t.server.insufficientStockDuringOrder, { name: freshProduct?.name ?? t.server.fallbackProduct }));
        }
      }

      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: user.id,
          buyerName: user.name,
          buyerEmail: user.email,
          buyerPhone: user.phone || null,
          companyName: user.companyName || null,
          totalPrice,
          shippingAddress,
          notes: notes || null,
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              productName: item.product.name,
              price: item.product.price,
              quantity: item.quantity,
              subtotal: item.product.price * item.quantity,
            })),
          },
        },
      });

      for (const item of cartItems) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      await tx.cart.deleteMany({ where: { userId: user.id } });

      return newOrder;
    });

    orderId = order.id;
  } catch (err: any) {
    return { error: err?.message || t.server.orderFailed };
  }

  revalidatePath("/keranjang");
  revalidatePath("/pesanan");
  redirect(`/pesanan/${orderId}`);
}

export async function undoAddToCart(productId: string, quantityToRemove: number = 1) {
  const user = await requireUser();
  const t = await getServerMessages();
  // Find cart item for this user and product
  const existingItem = await prisma.cart.findUnique({
    where: { userId_productId: { userId: user.id, productId } },
  });
  if (existingItem) {
    const newQuantity = existingItem.quantity - quantityToRemove;
    if (newQuantity <= 0) {
      // Hapus seluruh entri jika quantity habis
      await prisma.cart.delete({ where: { id: existingItem.id } });
    } else {
      // Decrement sejumlah yang baru ditambahkan
      await prisma.cart.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity },
      });
    }
    revalidatePath("/keranjang");
    return { success: true };
  }
  return { error: t.server.itemNotFound };
}
