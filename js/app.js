// 分为三部分组件
// 头部
let todoHeader = {
	template: `
		<header class="header">
			<h1>todos</h1>
			<input
				class="new-todo"
				placeholder="What needs to be done?"
				autofocus
				v-model="todoName"
				@keyup.enter="addTodo"
			/>
		</header>
	`,
	data() {
		return {
			todoName: ''
		}
	},
	methods: {
		addTodo() {
			if (this.todoName.trim() === '') {
				return
			}
			// 将父组件传过来的事件调用,将数据通过参数传递给父组件
			this.$emit('add-todo', this.todoName)
			// 传输完毕后,将添加栏中内容清空
			this.todoName = ''
		}
	}
}

// 列表
let todoList = {
	template: `
		<section class="main">
			<input id="toggle-all" class="toggle-all" type="checkbox" />
			<label for="toggle-all">Mark all as complete</label>
			<ul class="todo-list">
				<!--
					1.任务已完成状态:completed
					2.编辑状态:editing
					-->
				<li :class="{ completed:item.completed , editing:editId === item.id }" v-for="(item,index) in todos">
					<div class="view">
						<input class="toggle" type="checkbox" v-model="item.completed" />
						<label @dblclick="showEditBox(item.id)">{{ item.name }}</label>
						<button class="destroy" @click="removeTodo(index)"></button>
					</div>
					<input class="edit" v-model="item.name" @keyup.enter="hideEditBox(item.name)" />
				</li>
			</ul>
		</section>
	`,
	data() {
		return {
			editId: -1
		}
	},
	props: ['todos'],
	methods: {
		// 将需要删除的index传给父组件
		removeTodo(index) {
			this.$emit('remove-todo', index)
		},
		// 显示编辑框
		showEditBox(id) {
			this.editId = id
		},
		// 隐藏编辑框
		hideEditBox(name) {
			// 判断编辑框中是否为空,如果空,则不作为
			if (name.trim() === '') {
				return
			}
			this.editId = -1
		}
	}
}

// 底部
let todoFooter = {
	template: `
		<footer class="footer" v-show="isShowFooter">
			<span class="todo-count"><strong>{{ notCompletedTotal }}</strong> item left</span>
			<ul class="filters">
				<li>
					<a class="selected" href="#/">All</a>
				</li>
				<li>
					<a href="#/active">Active</a>
				</li>
				<li>
					<a href="#/completed">Completed</a>
				</li>
			</ul>
			<button class="clear-completed" v-show="isShowCompletedButton" @click="removeTodos">Clear completed</button>
		</footer>
	`,
	props: ['isShowFooter', 'notCompletedTotal', 'isShowCompletedButton'],
	methods: {
		removeTodos() {
			// 触发父组件的传过来的删除事件
			this.$emit('remove-todos')
		}
	}
}

let vm = new Vue({
	el: '#app',
	data: {
		todos: [
			{ id: 1, name: '吃饭', completed: false },
			{ id: 2, name: '睡觉', completed: true },
			{ id: 3, name: '玩游戏', completed: false },
			{ id: 4, name: '打豆豆', completed: true }
		]
	},
	components: {
		'todo-header': todoHeader,
		'todo-list': todoList,
		'todo-footer': todoFooter
	},
	methods: {
		// 添加任务
		addTodo(name) {
			// id动态生成,数组最后一项的id+1,如果数组数据为空,则id=1
			let id
			if (this.todos.length === 0) {
				id = 1
			} else {
				id = this.todos[this.todos.length - 1].id + 1
			}
			this.todos.push({
				id,
				name,
				completed: false
			})
		},
		// 删除任务
		removeTodo(index) {
			this.todos.splice(index, 1)
		},
		// 删除多个任务
		removeTodos() {
			this.todos = this.todos.filter(item => !item.completed)
		}
	},
	computed: {
		// 是否显示底部
		isShowFooter() {
			return this.todos.length > 0
		},
		// 未完成的任务数目
		notCompletedTotal() {
			return this.todos.filter(item => !item.completed).length
		},
		// 是否显示删除多个已完成的按钮
		isShowCompletedButton() {
			return this.todos.some(item => item.completed)
		}
	}
})
