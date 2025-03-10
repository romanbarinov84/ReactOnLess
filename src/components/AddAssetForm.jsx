import { useState, useRef } from "react";
import { Select, Space, Typography, Flex, Divider, Form, InputNumber, Button, DatePicker, Result } from "antd";
import { useCrypto } from "../context/crypto-context";

const validateMessages = {
  required: "${label} is required!",
  types: {
    number: "${label} is not valid number",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

export default function AddAssetForm({ onClose }) {
  const [form] = Form.useForm();
  const { crypto, addAsset } = useCrypto();
  const [coin, setCoin] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const assetRef = useRef(null);

  if (submitted && assetRef.current) {
    return (
      <Result
        status="success"
        title="New Asset Added"
        subTitle={`Added ${assetRef.current.amount} of ${coin.name} by price ${assetRef.current.price}`}
        extra={[
          <Button type="primary" key="console" onClick={onClose}>
            Close
          </Button>,
        ]}
      />
    );
  }

  if (!coin) {
    return (
      <Select
        onSelect={(v) => setCoin(crypto.find((c) => c.id === v))}
        placeholder="Select Coin"
        options={crypto.map((coin) => ({
          label: coin.name,
          value: coin.id,
          icon: coin.icon ?? "",
        }))}
        optionRender={(option) => (
          <Space>
            {option.data.icon && <img style={{ width: 20 }} src={option.data.icon} alt={option.data.label} />}
            {option.data.label}
          </Space>
        )}
      />
    );
  }

  function onFinish(values) {
    if (!values.date) return;
    const newAsset = {
      id: coin.id,
      amount: values.amount,
      price: values.price,
      date: values.date,
    };
    assetRef.current = newAsset;
    setSubmitted(true);
    addAsset(newAsset);
  }

  function handleAmountChange(value) {
    const price = form.getFieldValue("price");
    if (value !== undefined && price !== undefined) {
      form.setFieldsValue({
        total: +(value * price).toFixed(2),
      });
    }
  }

  function handlePriceChange(value) {
    const amount = form.getFieldValue("amount");
    if (amount !== undefined && value !== undefined) {
      form.setFieldsValue({
        total: +(amount * value).toFixed(2),
      });
    }
  }

  return (
    <Form
      form={form}
      name="basic"
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 10 }}
      style={{ maxWidth: 600 }}
      initialValues={{ price: +(coin?.price ?? 0).toFixed(2) }} // ✅ исправлено
      onFinish={onFinish}
      validateMessages={validateMessages}
    >
      <Flex align="center">
        <img src={coin.icon} alt={coin.name} style={{ width: 40, marginRight: 10 }} />
        <Typography.Title level={2} style={{ margin: 0 }}>
          {coin.name}
        </Typography.Title>
      </Flex>
      <Divider />

      <Form.Item
        label="Amount"
        name="amount"
        rules={[
          { required: true, message: "Amount is required" },
          { validator: (_, value) => (value > 0 ? Promise.resolve() : Promise.reject("Amount must be greater than 0")) },
        ]}
      >
        <InputNumber placeholder="Enter coin amount" style={{ width: "100%" }} onChange={handleAmountChange} />
      </Form.Item>

      <Form.Item
        label="Price"
        name="price"
        rules={[
          { required: true, message: "Price is required" },
          { validator: (_, value) => (value > 0 ? Promise.resolve() : Promise.reject("Price must be greater than 0")) },
        ]}
      >
        <InputNumber onChange={handlePriceChange} style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item label="Total" name="total">
        <InputNumber disabled style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item label="Date & Time" name="date" rules={[{ required: true, message: "Date is required" }]}>
        <DatePicker showTime />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Add Asset
        </Button>
      </Form.Item>
    </Form>
  );
}
