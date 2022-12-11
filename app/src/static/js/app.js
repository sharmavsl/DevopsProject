function App() {
    const { Container, Row, Col } = ReactBootstrap;

    return (
        <Container>
            <h2 className="main-title">Welcome to E-commerce Admin Panel</h2>
            <Row>
                <Col md={{ offset: 3, span: 6 }}>
                    <TodoListCard />
                </Col>
            </Row>
        </Container>
    );
}

function TodoListCard() {
    const { Table } = ReactBootstrap;
    const [items, setItems] = React.useState(null);

    React.useEffect(() => {
        fetch('/items')
            .then(r => r.json())
            .then(setItems);
    }, []);

    const onNewItem = React.useCallback(
        newItem => {
            setItems([...items, newItem]);
        },
        [items],
    );

    const onItemUpdate = React.useCallback(
        item => {
            const index = items.findIndex(i => i.id === item.id);
            setItems([
                ...items.slice(0, index),
                item,
                ...items.slice(index + 1),
            ]);
        },
        [items],
    );

    const onItemRemoval = React.useCallback(
        item => {
            const index = items.findIndex(i => i.id === item.id);
            setItems([...items.slice(0, index), ...items.slice(index + 1)]);
        },
        [items],
    );

    if (items === null) return 'Loading...';

    return (
        <React.Fragment>
            <AddItemForm onNewItem={onNewItem} />
            {items.length === 0 ? (
                <p className="text-center">No items yet! Add one above!</p>
            ) : (
                <Table striped hover variant="dark">
                    <thead>
                        <tr>
                            <th>Product Name</th>
                            <th>Product Quantity</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <ItemDisplay
                                item={item}
                                key={item.id}
                                onItemUpdate={onItemUpdate}
                                onItemRemoval={onItemRemoval}
                            />
                        ))}
                    </tbody>
                </Table>)}
        </React.Fragment>
    );
}

function AddItemForm({ onNewItem }) {
    const { Form, InputGroup, Button } = ReactBootstrap;

    const [newItem, setNewItem] = React.useState('');
    const [newItemQuantity, setNewItemQuantity] = React.useState('');

    const [submitting, setSubmitting] = React.useState(false);

    const submitNewItem = e => {
        e.preventDefault();
        setSubmitting(true);
        fetch('/items', {
            method: 'POST',
            body: JSON.stringify({ name: newItem, quantity: newItemQuantity }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(r => r.json())
            .then(item => {
                onNewItem(item);
                setSubmitting(false);
                setNewItem('');
            });
    };

    return (
        <Form onSubmit={submitNewItem}>
            <InputGroup className="mb-3">
                <Form.Control
                    value={newItem}
                    onChange={e => setNewItem(e.target.value)}
                    type="text"
                    placeholder="New Product"
                    aria-describedby="basic-addon1"
                />
                <Form.Control
                    value={newItemQuantity}
                    onChange={e => setNewItemQuantity(e.target.value)}
                    type="text"
                    placeholder="Product Quantity"
                    aria-describedby="basic-addon1"
                />
                <InputGroup.Append>
                    <Button
                        type="submit"
                        variant="success"
                        disabled={!newItem.length}
                        className={submitting ? 'disabled' : ''}
                    >
                        <i className="fa fa-plus text-white" style={{ marginRight: '10px' }} />
                        {submitting ? 'Adding...' : 'Add Product'}
                    </Button>
                </InputGroup.Append>
            </InputGroup>
        </Form>
    );
}


function ItemDisplay({ item, onItemUpdate, onItemRemoval }) {
    const { Form, Button } = ReactBootstrap;

    const [newItem, setNewItem] = React.useState(item.name);
    const [newItemQuantity, setNewItemQuantity] = React.useState(item.quantity);
    const [isEdit, setIsEdit] = React.useState(false);

    const removeItem = () => {
        fetch(`/items/${item.id}`, { method: 'DELETE' }).then(() => {
            window.alert('The record has been deleted successfully!!!')
            onItemRemoval(item)
        });
    };

    const editItem = () => {
        fetch(`/items/${item.id}`, {
            method: 'PUT',
            body: JSON.stringify({
                name: newItem,
                quantity: newItemQuantity,
            }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(r => r.json())
            .then(onItemUpdate)
            .then(() => {
                window.alert('The record has been updated successfully!!!')
                setIsEdit(false);
            })
    };

    return (
        <tr>
            <td>
                {isEdit ?
                    <Form.Control
                        type="text"
                        value={newItem}
                        onChange={e => setNewItem(e.target.value)}
                        id="inputPassword5"
                        aria-describedby="passwordHelpBlock"
                    />
                    : item.name}
            </td>
            <td>
                {isEdit ?
                    <Form.Control
                        value={newItemQuantity}
                        onChange={e => setNewItemQuantity(e.target.value)}
                        type="text"
                        placeholder="Product Quantity"
                        style={{ maxWidth: '5rem' }}
                    />
                    : item.quantity}
            </td>
            <td>
                {!isEdit ? (
                    <React.Fragment>
                        <Button
                            size="sm"
                            variant="link"
                            onClick={() => setIsEdit(true)}
                            aria-label="Edit Product"
                        >
                            <i className="fa fa-pen text-white" />
                        </Button>
                        <Button
                            size="sm"
                            variant="link"
                            onClick={removeItem}
                            aria-label="Remove Product"
                        >
                            <i className="fa fa-trash text-white" />
                        </Button>
                    </React.Fragment>) :
                    <Button onClick={editItem} variant="success">
                        <i className="fa fa-pen text-white" style={{ marginRight: '10px' }} />
                        Done
                    </Button>
                }
            </td>
        </tr>
    );
}

ReactDOM.render(<App />, document.getElementById('root'));
