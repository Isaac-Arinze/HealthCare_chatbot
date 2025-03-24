from transformers import AutoModelForCausalLM, AutoTokenizer
import torch
import re

class LLMModel:
    def __init__(self, model_name="TinyLlama/TinyLlama-1.1B-Chat-v1.0", access_token=None):
        # Load a smaller model for testing purposes
        # In production, you might want to use a larger model like "meta-llama/Llama-2-7b-chat-hf"
        self.tokenizer = AutoTokenizer.from_pretrained(model_name, use_auth_token=access_token)
        self.model = AutoModelForCausalLM.from_pretrained(
            model_name, 
            torch_dtype=torch.float16,
            device_map="auto",
            use_auth_token=access_token
        )
        self.intents = [
            "appointment_booking", 
            "appointment_cancellation",
            "visiting_hours", 
            "medical_records", 
            "queue_status",
            "lab_results", 
            "prescription_refill", 
            "billing_inquiry",
            "general_inquiry"
        ]
    
    def generate_response(self, message, context=None):
        # Simple prompting format for the model
        prompt = f"<human>: {message}\n<assistant>:"
        
        # Add context information if available
        if context and context.get("previous_messages"):
            prev_messages = context.get("previous_messages", [])
            context_text = "\n".join(prev_messages)
            prompt = f"{context_text}\n{prompt}"
        
        # Generate response with the model
        inputs = self.tokenizer(prompt, return_tensors="pt").to(self.model.device)
        outputs = self.model.generate(
            inputs.input_ids,
            max_new_tokens=256,
            temperature=0.7,
            top_p=0.9,
        )
        response = self.tokenizer.decode(outputs[0][inputs.input_ids.shape[1]:], skip_special_tokens=True)
        
        # Clean up the response
        response = response.strip()
        
        # Handle medical queries with caution
        if self._is_medical_advice(message):
            response += "\n\nPlease note that this is general information. For specific medical advice, please consult with a healthcare professional."
        
        return response
    
    def detect_intent(self, message):
        # Simple rule-based intent detection
        message = message.lower()
        
        if re.search(r"book|schedule|appoint|reserve", message):
            return "appointment_booking"
        elif re.search(r"cancel|reschedule", message):
            return "appointment_cancellation"
        elif re.search(r"visiting|hours|open|close", message):
            return "visiting_hours"
        elif re.search(r"record|history|medical file|ehr", message):
            return "medical_records"
        elif re.search(r"queue|wait|line|status", message):
            return "queue_status"
        elif re.search(r"lab|test|result", message):
            return "lab_results"
        elif re.search(r"prescription|refill|medicine|medication", message):
            return "prescription_refill"
        elif re.search(r"bill|invoice|payment|insurance|cost", message):
            return "billing_inquiry"
        else:
            return "general_inquiry"
    
    def _is_medical_advice(self, message):
        # Check if the message is asking for specific medical advice
        medical_keywords = [
            "diagnose", "treatment", "symptom", "medicine", "drug", 
            "dosage", "side effect", "pain", "disease", "condition"
        ]
        
        message = message.lower()
        return any(keyword in message for keyword in medical_keywords)