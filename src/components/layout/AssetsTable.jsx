import { Table } from 'antd';
import { useCrypto } from "../../context/crypto-context";

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    showSorterTooltip: {
      target: 'full-header',
    },
    onFilter: (value, record) => record.name.indexOf(value) === 0,
    sorter: (a, b) => a.name.length - b.name.length,
    sortDirections: ['descend'],
  },
  {
    title: 'Price, $',
    dataIndex: 'price',
    defaultSortOrder: 'descend',
    sorter: (a, b) => a.price - b.price,  // Используйте 'price' для сортировки
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    filters: [
      {
        text: 'Less than 1',
        value: 'less_than_1',
      },
      {
        text: 'More than 100',
        value: 'more_than_100',
      },
    ],
    onFilter: (value, record) => {
      if (value === 'less_than_1') {
        return record.amount < 1;
      }
      if (value === 'more_than_100') {
        return record.amount > 100;
      }
      return true;
    },
  },
];

export default function AssetsTable() {
  const { assets } = useCrypto();
  const data = assets.map((a) => ({
    key: a.id,
    name: a.name,
    price: a.price,
    amount: a.amount,
  }));

  const onChange = (pagination, filters, sorter) => {
    console.log('Various parameters', pagination, filters, sorter);
  };

  return (
    <Table
      columns={columns}
      dataSource={data}
      onChange={onChange}  // Добавлена функция обработки изменений
      showSorterTooltip={{
        target: 'sorter-icon',
      }}
    />
  );
}
