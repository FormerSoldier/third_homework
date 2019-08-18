var createItem = (name) =>{
    return {
        text: name,
        leaf: true
    }
}

Ext.onReady(function(){
    var window;

    var addStudent = (selectedNode, val)=> {
        if(schoolNode == selectedNode.parentNode){
            if(selectedNode.leaf)
                selectedNode.leaf = false;
            selectedNode.appendChild(createItem(val));

        }else if(selectedNode.parentNode != null){
            selectedNode.parentNode.appendChild(createItem(val));
        }                               
    }
    
    var addClass = (val) => {      
        schoolNode.appendChild(createItem(val));
    }

    var menu = new Ext.menu.Menu({
        items:[{
            id:'addStudent',
            text: 'add Student'
        },{
            id: 'addClass',
            text:'add class'
        }],
        listeners:{
            itemclick:function(item){
                let currentNode = item.parentMenu.contextNode;
                switch(item.id){
                    case 'addStudent':
                        if(currentNode === schoolNode){
                            Ext.Msg.alert('message','please select the class or student to do this operation');
                            break;
                        }
                        Ext.Msg.prompt('add Student','please enter the student name',function(btn,text){
                            console.log(text);
                            if(btn == 'ok')
                                addStudent(currentNode,text);
                        });
                        break;
                    case 'addClass':
                        Ext.Msg.prompt('add class','please enter the class name',function(btn,text){
                            console.log(text);
                            if(btn == 'ok')
                                addClass(text);
                        });
                        break;
                }
            }
        }
    });

    var inputPanel = new Ext.TabPanel({
        id:'inputPanel',
        activeTab:0,
        width:400,
        height:100,
        items:[
            {
                id:'student',
                title:'student',
                xtype:'textfield'
            },{
                id:'class',
                title:'class',
                xtype:'textfield'
            }
        ],
        buttons:[
            {
                text:'add',
                listeners:{
                    click:function(){
                        let inputPanel = Ext.getCmp('inputPanel');
                        let type = inputPanel.getActiveTab().title;
                        let selectedNote = tree.selectedNode;

                        let temp;
                        if(selectedNote == null || selectedNote === schoolNode){
                            window.hide();
                            Ext.Msg.alert('error','you selected the school or selected nothing');
                            return ;
                        }
                           

                        if(
                            type === 'student'){
                            //let student = Ext.getCmp('student');
                            temp = Ext.getCmp('student');
                            addStudent(selectedNote,temp.getValue());  
                        }else if(type === 'class'){
                            temp = Ext.getCmp('class');
                            addClass(temp.getValue());
                        }

                        //inputPanel.setValue('');
                        temp.setValue('');
                        console.log(inputPanel);
                        window.hide();
                    }
                }
            }
        ]
    });

    var createWindow = () =>{
        window = new Ext.Window({
            modal:true,
            items:[inputPanel],
            listeners:{
                beforeclose :function(p){
                    p.hide();
                    return false;
                }
            }
        });
    }

    var tree = new Ext.tree.TreePanel({
        useArrows:true,
        border:false,
        //cls:'treeCss',
        //containerScroll: true, 

        region:'west',  
        width:400,
        collapsible:true,
        enableDD:true,
        
        tbar:['->',
            {
                xtype:'button',
                text:'add',
                listeners:{
                    click:function(){
                        if(!window){
                            console.log('create window');
                            createWindow(); 
                        }       
                        console.log(window);
                        window.show();
                    }
                }
            }
        ],
        loader: new Ext.tree.TreeLoader({dataUrl:'student_class_information.txt'}),
        root: new Ext.tree.AsyncTreeNode({text:'爱心小学🏫',iconCls:'studentIcon',}),
        contextMenu: menu,
        listeners:{
            click: function(node){
                this.selectedNode = node;
            },
            contextmenu:function(node,event){
                node.select();
                console.log(node);
                node.select();
                var treeContextMenu = node.getOwnerTree().contextMenu;
                treeContextMenu.contextNode = node;
                treeContextMenu.showAt(event.getXY());
            }
        }
    });
    var schoolNode = tree.root;
    var treeEditor = new Ext.tree.TreeEditor(tree,{
        allowBlank:false
    },{
        listeners:{
            complete: function(){
                console.log('is changed');
            }
        }
    });

    var viewport = new Ext.Viewport({
        title:'student manager',
        layout:'border',
        items:[tree,{
            region:'center'
        }]
    });
});