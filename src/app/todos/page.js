'use client'

import { useState, useEffect } from 'react';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import DeleteForever from '@mui/icons-material/DeleteForever';
import AddBox from '@mui/icons-material/AddBox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';

export default function ToDos() {

    const [todos, setTodos] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [newTodo, setNewTodo] = useState('');

    function inputChangeHandler(e) {
        setNewTodo(e.target.value);
    }

    function addNewTodo() {
        if(newTodo && newTodo.length) {
            fetch("/api/todos", { method: "post", body: JSON.stringify({value: newTodo, done: false}) } ).then((response) => {
                return response.json().then((newTodo) => {
                    setTodos([...todos, newTodo]);
                    setNewTodo('');
                });
            });
        }
    }

    function removeTodo({ index }) {
        const todoItem = todos[index];
        fetch(`/api/todos/${todoItem.id}`, { method: 'delete' }).then((res) => {
            if (res.ok) {
                setTodos(todos.filter((v,idx) => idx!==index));
            }
        });
    }

    function toggleDone({idx, item}) {
        let updatedItem = {...item, done: !item.done};
        fetch(`/api/todos/${item.id}}`, {method: 'put', body: JSON.stringify(updatedItem)}).then((res) => {
            if(res.ok) {
                const updatedTodos = [...todos];
                updatedTodos[idx] = updatedItem;
                setTodos(updatedTodos);
            }
        });
    }

    useEffect(() => {
        fetch("/api/todos", { method: "get" }).then((response) => response.ok && response.json()).then(
            todos => {
                todos && setTodos(todos);
                setIsLoading(false);
            }
        );
    }, []);

    const loadingItems = <CircularProgress/>;

    const toDoItems = isLoading ? loadingItems : todos.map((todo, idx) => {
        return <ListItem key={idx} secondaryAction={
            <IconButton edge="end" onClick={() => removeTodo({index: idx})} aria-label='delete todo'><DeleteForever/></IconButton>   
        }>  
            <ListItemButton>
                <ListItemIcon>
                    <Checkbox checked={todo.done} disableRipple onChange={() => {
                        toggleDone({idx, item: todo})
                    }} aria-label="toggle done"/>
                </ListItemIcon>
                <ListItemText primary={todo.value}/>
            </ListItemButton>
        </ListItem>;
    });

    return (
        <>
            <h2>My ToDos</h2>
            <List sx={{ width: '100%', maxWidth: 500 }}>
                { toDoItems }
                {!isLoading && <ListItem key="newItem" secondaryAction={<IconButton edge="end" onClick={addNewTodo} aria-label="add button"><AddBox/></IconButton>}>
                    <TextField label="New ToDo Item" fullWidth variant="outlined" value={newTodo} onChange={inputChangeHandler}/> 
                </ListItem>}
            </List>
        </>
    );
}