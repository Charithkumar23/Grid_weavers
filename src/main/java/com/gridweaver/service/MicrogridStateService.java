package com.gridweaver.service;

import com.gridweaver.model.MicrogridState;
import org.springframework.stereotype.Service;

@Service
public class MicrogridStateService {

    public MicrogridState processState(MicrogridState state) {

        System.out.println("Processing Microgrid State...");
        System.out.println(state);

        return state;
    }
}