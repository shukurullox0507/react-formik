import React, { useEffect, useState } from "react";
import { Space, Table, Modal, Row, Col, Button, message } from "antd";
import { Formik, Field, ErrorMessage, FieldArray, Form } from "formik";

import type { ColumnsType } from "antd/es/table";
import { DataType } from "./types/types";
import axios from "axios";

const App: React.FC = () => {
  const [employeeData, setEmployeeData] = useState<DataType[]>([]);
  const [edit, setEdit] = useState<boolean>(false);
  const [currentEmployee, setCurrentEmployee] = useState<DataType>(
    {} as DataType
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const editModal = (record: DataType) => {
    setEdit(true);
    showModal(record);
  };

  const createModal = () => {
    setEdit(false);
    showModal(undefined);
  };

  const deleteModal = (record: DataType) => {
    Modal.warning({
      title: 'You are about to delete!',
      content: `${record.firstName}'s contents would be deleted permanantly. Are you sure?`,
      async onOk() {
        const requestOptions = {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
        };
        await axios.delete(
          `https://procom-interview-employee-test.azurewebsites.net/Employee/${record.id}`,
          requestOptions
        ).then((response) => {
          data();
          setCurrentEmployee({});
          message.info("Deletion completed successfully!");
        });
      },
    });
  };

  const showModal = (record: DataType | undefined) => {
    record ? setCurrentEmployee(record) : setCurrentEmployee({});
    setIsModalOpen(true);
  };

  const columns: ColumnsType<DataType> = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary" onClick={() => editModal(record)}>Edit {record.firstName}</Button>
          <Button type="primary" onClick={() => deleteModal(record)}>Delete</Button>
        </Space>
      ),
    },
  ];

  const data = async () => {
    const response = await axios.get(
      "https://procom-interview-employee-test.azurewebsites.net/Employee"
    );
    setEmployeeData(response.data);
  };

  useEffect(() => {
    data();
  }, []);

  return (
    <>
      <Modal
        title={`${edit ? "Edit" : "Create"} Employee`}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setCurrentEmployee({});
        }}
        footer={null}
      >
        <Formik
          initialValues={currentEmployee}
          onSubmit={async (values, actions) => {
            if (edit) {
              const requestOptions = {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
              };
              await axios.put(
                `https://procom-interview-employee-test.azurewebsites.net/Employee/${values.id}`,
                requestOptions
              ).then((response) => {
                data();
                setIsModalOpen(false);
                setCurrentEmployee({});
                actions.setSubmitting(false);
                actions.resetForm();
                message.info("Updation completed successfully!");
              });
            } else {
              const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(values),
              };
              await axios.post(
                `https://procom-interview-employee-test.azurewebsites.net/Employee`,
                requestOptions
              ).then((response) => {
                data();
                setIsModalOpen(false);
                setCurrentEmployee({});
                actions.setSubmitting(false);
                actions.resetForm();
                message.info("Creation completed successfully!");
              });
            }
          }}
        >
          {({ values }) => (
            <Form>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" span={12}>
                  <label htmlFor={`firstName`}>First Name</label>
                  <Field
                    name={`firstName`}
                    placeholder="First Name"
                    type="text"
                  />
                  <ErrorMessage
                    name={`firstName`}
                    component="div"
                    className="field-error"
                  />
                </Col>
                <Col className="gutter-row" span={12}>
                  <label htmlFor={`lastName`}>Last Name</label>
                  <Field
                    name={`lastName`}
                    placeholder="Last Name"
                    type="text"
                  />
                  <ErrorMessage
                    name={`lastName`}
                    component="div"
                    className="field-error"
                  />
                </Col>
                <Col className="gutter-row" span={12}>
                  <label htmlFor={`email`}>Email</label>
                  <Field name={`email`} placeholder="Email Id" type="email" />
                  <ErrorMessage
                    name={`email`}
                    component="div"
                    className="field-error"
                  />
                </Col>
                <Col className="gutter-row" span={12}>
                  <label htmlFor={`phoneNumber`}>Phone Number</label>
                  <Field
                    name={`phoneNumber`}
                    placeholder="Phone Number"
                    type="text"
                  />
                  <ErrorMessage
                    name={`phoneNumber`}
                    component="div"
                    className="field-error"
                  />
                </Col>
                <Col>Addresses</Col>
              </Row>
              <FieldArray name="addresses">
                {({ insert, remove, push }) => (
                  <div>
                    {values?.addresses && values?.addresses!.length > 0 &&
                      values?.addresses!.map((address, index) => (
                        <>
                          <Row
                            gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}
                            key={index}
                          >
                            <Col className="gutter-row" span={12}>
                              <label htmlFor={`addresses.${index}.streetName`}>
                                Street Name
                              </label>
                              <Field
                                name={`addresses.${index}.streetName`}
                                placeholder="Street Name"
                                type="text"
                              />
                              <ErrorMessage
                                name={`addresses.${index}.streetName`}
                                component="div"
                                className="field-error"
                              />
                            </Col>
                            <Col className="gutter-row" span={12}>
                              <label htmlFor={`addresses.${index}.postalCode`}>
                                Postal Code
                              </label>
                              <Field
                                name={`addresses.${index}.postalCode`}
                                placeholder="Postal Code"
                                type="text"
                              />
                              <ErrorMessage
                                name={`addresses.${index}.postalCode`}
                                component="div"
                                className="field-error"
                              />
                            </Col>
                            <Col className="gutter-row" span={12}>
                              <label
                                htmlFor={`addresses.${index}.apartmentNumber`}
                              >
                                Apartment Number
                              </label>
                              <Field
                                name={`addresses.${index}.apartmentNumber`}
                                placeholder="Apartment Number"
                                type="number"
                              />
                              <ErrorMessage
                                name={`addresses.${index}.apartmentNumber`}
                                component="div"
                                className="field-error"
                              />
                            </Col>
                            <Col className="gutter-row" span={12}>
                              <label htmlFor={`addresses.${index}.state`}>
                                State
                              </label>
                              <Field
                                name={`addresses.${index}.state`}
                                placeholder="State"
                                type="text"
                              />
                              <ErrorMessage
                                name={`addresses.${index}.state`}
                                component="div"
                                className="field-error"
                              />
                            </Col>
                            <Col className="gutter-row" span={12}>
                              <label htmlFor={`addresses.${index}.country`}>
                                Country
                              </label>
                              <Field
                                name={`addresses.${index}.country`}
                                placeholder="Country"
                                type="text"
                              />
                              <ErrorMessage
                                name={`addresses.${index}.country`}
                                component="div"
                                className="field-error"
                              />
                            </Col>
                            <Col className="gutter-row" span={12}>
                              <Button danger onClick={() => remove(index)}>
                                Delete Address
                              </Button>
                            </Col>
                          </Row>
                        </>
                      ))}
                    <Button
                      onClick={() =>
                        push({
                          streetName: "",
                          postalCode: "",
                          apartmentNumber: "",
                          state: "",
                          country: "",
                        })
                      }
                    >
                      Add Address
                    </Button>
                  </div>
                )}
              </FieldArray>
              <div>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col
                    className="gutter-row"
                    span={12}
                    style={{ textAlign: "right" }}
                  >
                    <Button type="primary" htmlType="submit">
                      Submit
                    </Button>
                  </Col>
                </Row>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>

      <Table
        columns={columns} 
        dataSource={employeeData} 
        pagination={{ pageSize: 10 }}
        />
                      
      <Button type="primary" onClick={() => createModal()} style={{
        marginLeft:'600px'
      }}>
        Create Employee
      </Button>
    </>
  );
};

export default App;
