import ToDos from '../page';
import { render, act, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import { enableFetchMocks } from 'jest-fetch-mock'

describe('todos page', () => {

  beforeEach(() => {
    enableFetchMocks();
  })

  afterEach(() => {
    fetch.resetMocks();
  })

  let idx = 0;

  buildTodo = function(done, value) {
    return {
      id: idx++, 
      done, 
      value
    }
  };

  testNumberOfTodos = function(todos, length) {
    // the plus one here is because we also have the add todos which is always there
    expect(todos.container.querySelectorAll('li')).toHaveLength(length+1);
  }

  it('should render with an empty list of todos', async () => {
    fetch.once(JSON.stringify([]));
    let todos; 
    await act(() => { 
      todos = render(<ToDos/>); 
    });
    testNumberOfTodos(todos, 0);
  });

  it('should render each todo', async () => {
    fetch.once(JSON.stringify([buildTodo(true, 'todo 1'), buildTodo(false, 'todo 2')]));
  
    let todos; 
    await act(() => { 
      todos = render(<ToDos/>); 
    });
    testNumberOfTodos(todos, 2);
  });

  it('should add a new todo', async () => {
    fetch.once(JSON.stringify([]))
         .once(JSON.stringify([buildTodo(true, 'New ToDo Item')]))
    let todos;
    await act(() => {
      todos = render(<ToDos/>);
    });
    const input = todos.getByLabelText('New ToDo Item');
    fireEvent.change(input, { target: { value: 'new todo for test' }});
    const add = todos.getByRole('button', { name: 'add button'});
    fireEvent.click(add);
    expect(fetch).toBeCalledWith('/api/todos', {method: 'post', body: "{\"value\":\"new todo for test\",\"done\":false}"});
    expect(fetch).toBeCalledWith('/api/todos', {method: 'get'});
  });
  
  it('should mark a todo item done', async () => {
    const item = buildTodo(false, 'New ToDo Item');
    fetch.once(JSON.stringify([item]))
         .once(JSON.stringify([{...item, done: true}]));
    let todos;
    await act(() => {
      todos = render(<ToDos/>);
    });
    expect(todos.container.querySelectorAll('li')).toHaveLength(2);
    const toggle = todos.getByLabelText('toggle done');
    const toggleInput = toggle.querySelector('input');
    toggleInput.click();
    expect(fetch.mock.calls.length).toEqual(2);
    expect(fetch.mock.calls[1][1]).toEqual({method: 'put', body: JSON.stringify({...item, done: true})});
  });

  it('should try to delete an item', async () => {
    const item = buildTodo(false, 'New ToDo Item');
    fetch.once(JSON.stringify([item]))
         .once(JSON.stringify(item));
    let todos;
    await act(() => {
      todos = render(<ToDos/>);
    });
    const deleteTodo = todos.getByLabelText('delete todo');
    deleteTodo.click();
    expect(fetch.mock.calls.length).toEqual(2);
    expect(fetch.mock.calls[1][0]).toEqual("/api/todos/"+item.id);
    expect(fetch.mock.calls[1][1]).toEqual({method: 'delete'});
  });
})