import React from "react";
import { Modal, Form, Input, DatePicker, Select, Button } from "antd";

function AddExpenseModal({
  isExpenseModalVisible ,
  handleExpenseCancel,
  onFinish,
}) {
  const [form] = Form.useForm();
  return (
    <Modal
      className="finflow-modal expense-modal"
      centered
      width={480}
      title={<div className="modal-title-wrapper"><span className="modal-title-icon expense-icon">💸</span>Add Expense</div>}
      open={isExpenseModalVisible }
      onCancel={() => {
        form.resetFields();
        handleExpenseCancel();
      }}
      footer={null}
    >
      <Form
        className="finflow-form"
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onFinish(values, "expense");
          form.resetFields();
          handleExpenseCancel();
        }}
      >
        <Form.Item
          label="Name"
          name="name"
          rules={[
            {
              required: true,
              message: "Please input the name of the transaction!",
            },
          ]}
        >
          <Input type="text" placeholder="e.g., Grocery Shopping" />
        </Form.Item>
        <Form.Item
          label="Amount"
          name="amount"
          rules={[
            { required: true, message: "Please input the expense amount!" },
          ]}
        >
          <Input type="number" placeholder="Enter amount" />
        </Form.Item>
        <Form.Item
          label="Date"
          name="date"
          rules={[
            { required: true, message: "Please select the expense date!" },
          ]}
        >
          <DatePicker className="date-input" format="YYYY-MM-DD" />
        </Form.Item>
        <Form.Item
          label="Category"
          name="tag"
          rules={[{ required: true, message: "Please select a category!" }]}
        >
          <Select placeholder="Select a category">
            <Select.Option value="food">Food</Select.Option>
            <Select.Option value="groceries">Groceries</Select.Option>
            <Select.Option value="education">Education</Select.Option>
            <Select.Option value="transport">Transport</Select.Option>
            <Select.Option value="shopping">Shopping</Select.Option>
            <Select.Option value="health">Health</Select.Option>
            <Select.Option value="bills">Bills</Select.Option>
            <Select.Option value="rent">Rent</Select.Option>
            <Select.Option value="entertainment">Entertainment</Select.Option>
            <Select.Option value="travel">Travel</Select.Option>
            <Select.Option value="office">Office</Select.Option>
            <Select.Option value="other">Other</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item style={{ marginBottom: 0 }}>
          <Button className="btn btn-blue" type="primary" htmlType="submit" block>
            Add Expense
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddExpenseModal;