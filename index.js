import { experimental_createMCPClient, generateText } from 'ai';
import { Experimental_StdioMCPTransport } from 'ai/mcp-stdio';
import { openai } from '@ai-sdk/openai';
import dotenv from 'dotenv';

dotenv.config();

let clientOne;
//let clientTwo;
//let clientThree;

try {
    // Initialize an MCP client to connect to a `stdio` MCP server:
    const transport = new Experimental_StdioMCPTransport({
        command: 'node',
        args: ['./build/index.js'],
        cwd: '../mcp-spo-api/'
    });
    clientOne = await experimental_createMCPClient({
        transport,
    });

    //   // Alternatively, you can connect to a Server-Sent Events (SSE) MCP server:
    //   clientTwo = await experimental_createMCPClient({
    //     transport: {
    //       type: 'sse',
    //       url: 'http://localhost:3000/sse',
    //     },
    //   });

    //   // Similarly to the stdio example, you can pass in your own custom transport as long as it implements the `MCPTransport` interface:
    //   const transport = new MyCustomTransport({
    //     // ...
    //   });
    //   clientThree = await experimental_createMCPClient({
    //     transport,
    //   });

    const toolSetOne = await clientOne.tools();
    //const toolSetTwo = await clientTwo.tools();
    //const toolSetThree = await clientThree.tools();
    const tools = {
        ...toolSetOne,
        //...toolSetTwo,
        //...toolSetThree, // note: this approach causes subsequent tool sets to override tools with the same name
    };
    const toolSet = await clientOne.tools();
    console.log('Tool set:', toolSet);


    while (true) {
        const question = 'trouve les tiers avec une adresse dans la ville VENISSIEUX';
        //lire la question à partir de l'entrée standard
        //const question = await new Promise((resolve) => {
        //     process.stdin.once('data', (data) => {
        //         resolve(data.toString().trim());
        //     });
        // });
        if (question === 'exit') {
            break;
        };

        console.log('Question:', question);
        const response = await generateText({
            model: openai('gpt-4o'),
            tools,
            messages: [
                {
                    role: 'user',
                    content: question,
                },
            ],
            maxSteps: 100,
        });
        console.log(response.text);
    }
} catch (error) {
    console.error(error);
} finally {
    await Promise.all([clientOne.close()]);
}