import { createInterface } from "readline";
import User, { IUserRecord } from "./models/user";

interface IDocs {
    [key: string]: string | number
}

const Docs: IDocs = {
    help: `
        Console to interact with Nobox service

        Commands are 'help', 'create', 'update', 'get', 'all', 'quit'

        To get decription of a command, enter "help [command]"
    `,
    create: `
    create - Used to create a new User
        receives email, password, firstname, age

        Usage:
            create email="sample@mail.com" password="letmein" firstname="Precious" age="20"
        
        Fields:
            email: required
            password: required
            firstname: required
            age: optional
        
        Note:
            You can skip the use of quotation marks (' or ")
    `,
    update: `
    update - Used to update a User by id
        receives id, email, password, firstname, age

        Usage:
            update id="2dfsklm" age="21"
        
        Fields:
            id: required
            email: optional
            password: optional
            firstname: optional
            age: optional
    
        Note:
            - You can skip the use of quotation marks (' or ")
            - At least, one of email, password, firstname or age must be provided.
    `,
    get: `
    get - Used to retrieve a User by id
        receives id

        Usage:
            update id="2dfsklm"
        
        Fields:
            id: required
    
        Note:
            You can skip the use of quotation marks (' or ")
    `,
    all: `
    all - Used to fetch all users

        Usage:
            all
    `
}


const readline = createInterface({
    input: process.stdin,
    output: process.stdout
});

class Console {
    

    private static async readLine(prompt:string): Promise<string> {
        return new Promise((resolve)=>{
            readline.question(prompt, (input)=>{
                resolve(input);
            })
        })
    }

    private static closeInputReader () {
        readline.close()
    }


    // Methods

    static async readInput(prompt="> ") {
        return await Console.readLine(prompt);
    }


    static help(args:string[]) {

        // Reading just the first arg given

        const command = args[0];

        if (command) {
            const doc = Docs[command];

            if (!doc) console.log(`No help for "${command}"`);
            else console.log(doc)

        } else console.log(Docs['help'])

        return;
    }

    static async create(args: string[]) {
        // console.log(args);

        // Parse args
        const params:IDocs = {}
        const fields = ['email', 'firstName', 'password', 'age'];

        args.forEach((item)=>{
            const [field, val] = item.split("=");

            if (fields.includes(field)) params[field] = val.replace(/"/g, '');
        });

        const missen_fields = fields.filter((item)=>!params[item])

        if (missen_fields.length > 0) {
            const field_count = missen_fields.length;

            console.log(`"${missen_fields.join('", "')}" field${field_count > 1 ? 's':''} ${field_count > 1 ? 'are':'is'} required.`);

            return;
        }

        // console.log(params);
        params["age"] = Number(params["age"]);

        await User.create(params as any);
        
        return;
    }

    static update(args: string[]) {
        console.log(args);
        return;
    }
    static get(args: string[]) {
        console.log(args);
        return;
    }
    static async all() {
        
        const records = await User.fetch({});
        console.log(records);
    }


    // Console switch
    static async run() {
        let running = true;

        do {
            let input = await Console.readInput();

            // Parse the command
            let [command, ...args] = input.trim().split(" ")
            // console.log(command, args);

            command = command.toLowerCase();

            if (!command) {
                continue
            }

            // Terminate consolse process
            if (command === 'quit') {
                running = false;
                continue;
            }

            if (command === 'help') {
                this.help(args)
                continue
            }

            if (command === 'create') {
                this.create(args);
                continue
            }

            if (command === 'update') {
                this.update(args);
                continue
            }

            if (command === 'get') {
                this.get(args);
                continue
            }

            if (command === 'all') {
                this.all();
                continue
            }


            console.log(`Unknown command ${command}`);

        } while(running);

        Console.closeInputReader();
    }
}

export default Console;