<template>
    <vs-row vs-justify="center">
        <vs-col type="flex" vs-justify="flex-start" vs-align="flex-start" vs-w="8">
        <h1 class="pb-5">Notes</h1> 
        <!-- <vs-button @click="notifyAction('danger','Created task','',false)" type="flat">Run Example</vs-button> -->
        <form>
          <h3>Add new note</h3>
          <vs-row>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="4">
              <vs-input 
                class="inputx my-2" 
                placeholder="Name" 
                v-model="note.name"
                :danger="invalidNoteName"
                danger-text="Please add a name"
                />
            </vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
              <vs-input class="inputx my-2" placeholder="Description" v-model="note.description" style="width:100%"/>
            </vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="2">
              <vs-button color="primary" size="default" type="filled" @click="addNote()">Add Note</vs-button>
            </vs-col>
          </vs-row>
          
        </form>
        <vs-table :data="notes">
            <template slot="header">
            </template>
            <template slot="thead">
                <vs-th>
                Name
                </vs-th>
                <vs-th>
                Description
                </vs-th>
                <vs-th>
                Date
                </vs-th>
                <vs-th>
                Actions
                </vs-th>
            </template>

            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data" vs-justify="flex-start">
                <vs-td :data="data[indextr].name" >
                    {{data[indextr].name}}
                </vs-td>

                <vs-td :data="data[indextr].description">
                    {{data[indextr].description}}
                </vs-td>

                <vs-td :data="data[indextr].date">
                    {{data[indextr].date}}
                </vs-td>
                <vs-td >
                  <vs-button color="rgb(79, 8, 231)" class="mr-1" type="filled" @click="prepareUpdate(tr.name,tr.description,tr._id)">Update</vs-button>
                  <vs-button color="danger" type="filled" @click="deleteNote(tr._id)">Delete</vs-button>  
                </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        </vs-col>

         <vs-prompt
            :active.sync="activePrompt"
            title="Update note"
            @accept="updateNote()">
            <vs-row  >
              <vs-col vs-w="12">
                <vs-input 
                  class="inputx my-2" 
                  placeholder="Name" 
                  v-model="updatingNote.name"
                  :danger="invalidUpdateNoteName"
                  danger-text="Please add a name"
                  />
              </vs-col>
              <vs-col vs-w="12" >
                <vs-input class="inputx my-2" placeholder="Description" v-model="updatingNote.description" style="width:100%"/>
              </vs-col>
            </vs-row>
          </vs-prompt>
    </vs-row>
</template>
<script>
import axios from 'axios';
import 'material-icons/iconfont/material-icons.css';
export default {
  name: "Notes",
  data(){
    return{
    notes:[],
    note:{
      name:'',
      description:'',
      userId: "12345"
    },
    updatingNote:{
      name:'',
      description:'',
      _id: 0,
      userId: "12345"
    },
    invalidNoteName:false,
    invalidUpdateNoteName:false,
    activePrompt:false,
    }
  },
  created() {
    this.listNotes();
  },
  methods:{
    listNotes(){
      axios.get('/notes')
      .then(res => {
        console.log(res);
        this.notes = res.data;
      })
      .catch(e => {
        console.log(e.response);
      });
    },
    notifyAction(action,title,description,fixed){
      //Colors = primary success danger warning dark
      this.$vs.notify({
        title:title,
        text:description,
        color:action,
        fixed:fixed
      })
    },
    addNote(){
      if (this.note.name !== '') {
        axios.post('/new-note',this.note)
        .then(res =>{
          this.notes.push(res.data);
          this.note.name='';
          this.note.description='';
          this.notifyAction('success','Added Note','',false);
        }
        )
        .catch(e => {
          console.log(e.response);
        });
      }else{
        this.invalidNoteName=true;
      }
    },
    deleteNote(id){
      axios.delete(`/note/${id}`).then(res => {
        const index = this.notes.findIndex(item => item._id === res.data.data._id);
        this.notes.splice(index,1);
        this.notifyAction('danger','Deleted Note',`Name: ${res.data.data.name}`,false);
      })
      .catch( e => {
        console.log(e.response);
      });
    },
    prepareUpdate(name,description,id)
    {
      this.updatingNote.name = name;
      this.updatingNote.description = description;
      this.updatingNote._id = id;
      this.activePrompt = true
    },
    updateNote(){
      axios.put(`/note/${this.updatingNote._id}`,this.updatingNote)
      .then(res => {
        const index = this.notes.findIndex(w => w._id === res.data._id);
        // console.log(index);
        // console.log(res.data);
        this.notes[index].name = res.data.name;
        this.notes[index].description = res.data.description;
        this.updatingNote.name = '';
        this.updatingNote.description = '';
        this.updatingNote._id = 0;
        this.notifyAction('warning','Updated Note','',false);
      })
      .catch( e => {
        console.log(e.response);
      });
    }
  }
}
</script>
<style scoped>
    /* tr{
        text-align: left;
    } */
</style>