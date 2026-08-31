import React from "react";
import { Modal, Form, Input, DatePicker, Select, Button } from "antd";

function AddIncomeModal({
  isIncomeModalVisible ,
  handleIncomeCancel,
  onFinish,
}) {
  const [form] = Form.useForm();
  return (
    <Modal
      className="finflow-modal income-modal"
      centered
      width={480}
      title={<div className="modal-title-wrapper"><span className="modal-title-icon income-icon">📈</span>Add Income</div>}
      open={isIncomeModalVisible  }
      onCancel={() => {
        form.resetFields();
        handleIncomeCancel();
      }}
      footer={null}
    >
      <Form
        className="finflow-form"
        form={form}
        layout="vertical"
        onFinish={(values) => {
          onFinish(values, "income");
          form.resetFields();
          handleIncomeCancel();
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
          <Input type="text" placeholder="e.g., Monthly Salary" />
        </Form.Item>
        <Form.Item
          label="Amount"
          name="amount"
          rules={[
            { required: true, message: "Please input the income amount!" },
          ]}
        >
          <Input type="number" placeholder="Enter amount" />
        </Form.Item>
        <Form.Item
          label="Date"
          name="date"
          rules={[
            { required: true, message: "Please select the income date!" },
          ]}
        >
          <DatePicker format="YYYY-MM-DD" className="date-input" />
        </Form.Item>
        <Form.Item
          label="Category"
          name="tag"
          rules={[{ required: true, message: "Please select a category!" }]}
        >
          <Select placeholder="Select a category">
            <Select.Option value="salary">Salary</Select.Option>
            <Select.Option value="freelance">Freelance</Select.Option>
            <Select.Option value="investment">Investment</Select.Option>
            <Select.Option value="bonus">Bonus</Select.Option>
            <Select.Option value="gifts">Gifts</Select.Option>
            <Select.Option value="business">Business</Select.Option>
            <Select.Option value="passive">Passive Income</Select.Option>
            <Select.Option value="other">Other</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item style={{ marginBottom: 0 }}>
          <Button className="btn btn-blue" type="primary" htmlType="submit" block>
            Add Income
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default AddIncomeModal;