import { Layout, Select, Space, Button, Modal, Drawer } from "antd";
import { useCrypto } from "../context/crypto-context.jsx";
import { useEffect, useState } from "react";
import CoinInfoModal from "./CoinInfoModal.jsx";
import AddAssetForm from "./AddAssetForm.jsx";

const headerStyle = {
  textAlign: "center",
  width: "100%",
  height: "60px",
  padding: "1rem",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  background: "cornFlowerBlue",
};

export default function AppHeader() {
  const [select, setSelect] = useState(false);
  const [coin, setCoin] = useState(null);
  const [modal, setModal] = useState(false);
  const [drawer, setDrawer] = useState(false);
  const { crypto } = useCrypto();

  useEffect(() => {
    const keypress = (event) => {
      if (event.key === "/") {
        setSelect((prev) => !prev);
      }
    };
    document.addEventListener("keypress", keypress);
    return () => document.removeEventListener("keypress", keypress);
  }, []);

  function handleSelect(value) {
    setCoin(crypto.find((c) => c.id === value));
    setModal(true);
  }

  return (
    <Layout.Header style={headerStyle}>
      <Select
        style={{
          width: 250,
        }}
        open={select}
        onSelect={handleSelect}
        onClick={() => setSelect((prev) => !prev)}
        value="Press / to open"
        options={crypto.map((coin) => ({
          label: coin.name,
          value: coin.id,
          icon: coin.icon || "", // защита от ошибки, если нет иконки
        }))}
        optionRender={(option) => (
          <Space>
            {option.data.icon && (
              <img
                style={{ width: 20 }}
                src={option.data.icon}
                alt={option.data.label}
              />
            )}
            {option.data.label}
          </Space>
        )}
      />
      <Button type="primary" onClick={() => setDrawer(true)}>
        Add Asset
      </Button>

      <Modal
        open={modal}
        onOk={() => setModal(false)}
        onCancel={() => setModal(false)}
        footer={null}
      >
        <CoinInfoModal coin={coin} />
      </Modal>
      <Drawer
        width={600}
        title="Add Asset"
        onClose={() => setDrawer(false)}
        open={drawer}
        destroyOnClose
      >
        <AddAssetForm onClose={() => setDrawer(false)} />
      </Drawer>
    </Layout.Header>
  );
}
